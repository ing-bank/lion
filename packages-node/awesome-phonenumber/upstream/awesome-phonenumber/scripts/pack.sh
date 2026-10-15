#!/usr/bin/env bash
#
# Produces a publish-equivalent npm tarball of a committed source revision,
# without publishing anything.
#
# Mirrors the release flow in .github/workflows/master.yml
# (yarn install, yarn build, yarn test, then semantic-release which sets the
# version and runs `npm publish`), except that the version is chosen
# explicitly and `npm pack` is used instead of `npm publish`.
#
# Environment:
#   PACK_VERSION      Version written into the packed package.json.
#                     Default: 7.9.0-tlouisse.libphonenumber-<libphonenumber.version>
#                     (7.8.0 is the latest awesome-phonenumber release; the
#                     libphonenumber bump is a feature, so the next release
#                     would be 7.9.0. The prerelease suffix marks it as a fork
#                     build that was never published by upstream.)
#   PACK_DESTINATION  Output directory. Default: <repo>/dist
#   PACK_SOURCE_REF   Git revision to pack. Default: HEAD
#   PACK_SKIP_TESTS   Set to 1 to skip `yarn test` (not recommended).
#   PACK_KEEP_STAGE   Set to 1 to keep the staging directory.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SOURCE_REF="${PACK_SOURCE_REF:-HEAD}"
SOURCE_COMMIT="$(git rev-parse --verify "${SOURCE_REF}^{commit}")"
LIBPHONENUMBER_VERSION="$(git show "${SOURCE_COMMIT}:libphonenumber.version" | tr -d '[:space:]')"
VERSION="${PACK_VERSION:-7.9.0-tlouisse.libphonenumber-${LIBPHONENUMBER_VERSION#v}}"
DEST="${PACK_DESTINATION:-$ROOT/dist}"
mkdir -p "$DEST"
DEST="$(cd "$DEST" && pwd)"

if [ "$SOURCE_REF" = "HEAD" ] && [ -n "$(git status --porcelain --untracked-files=no)" ]; then
	echo "warning: uncommitted changes are NOT included; packing ${SOURCE_COMMIT}" >&2
fi

# The staging directory must be named "awesome-phonenumber": rollup derives
# identifiers in index-esm.mjs from the package directory name.
STAGE_PARENT="$(mktemp -d)"
STAGE="$STAGE_PARENT/awesome-phonenumber"
cleanup( ) {
	if [ "${PACK_KEEP_STAGE:-0}" = "1" ]; then
		echo "Staging directory kept at $STAGE"
	else
		rm -rf "$STAGE_PARENT"
	fi
}
trap cleanup EXIT

mkdir -p "$STAGE"
git archive "$SOURCE_COMMIT" | tar -x -C "$STAGE"
cd "$STAGE"

echo "==> Packing awesome-phonenumber@${VERSION} from ${SOURCE_COMMIT} (libphonenumber ${LIBPHONENUMBER_VERSION})"

yarn install --immutable
yarn build
if [ "${PACK_SKIP_TESTS:-0}" != "1" ]; then
	CI=true yarn test
fi

# Report whether the freshly built output differs from the committed output
BUILD_MATCHES_COMMIT=true
for f in lib/index.js index.js index-esm.mjs index.d.ts; do
	if ! git -C "$ROOT" show "${SOURCE_COMMIT}:$f" | cmp -s - "$f"; then
		echo "note: built $f differs from the committed version" >&2
		BUILD_MATCHES_COMMIT=false
	fi
done

npm pkg set "version=${VERSION}"

# Same lifecycle as `npm publish` (prepack, prepare, postpack)
npm pack --json --pack-destination "$DEST" > "$DEST/pack.json"
npm publish --dry-run --json --tag tlouisse-fork --registry=https://registry.npmjs.org/ > "$DEST/publish-dry-run.json"

TARBALL="$DEST/$(node -p "require('$DEST/pack.json')[0].filename")"
SHA256="$(shasum -a 256 "$TARBALL" | cut -d' ' -f1)"
echo "$SHA256  $(basename "$TARBALL")" > "$TARBALL.sha256"

PACK_COMMIT="$SOURCE_COMMIT" \
PACK_LPN="$LIBPHONENUMBER_VERSION" \
PACK_SHA256="$SHA256" \
PACK_BUILD_MATCHES="$BUILD_MATCHES_COMMIT" \
node -e '
const fs = require( "fs" );
const [ pack ] = JSON.parse( fs.readFileSync( process.argv[ 1 ] + "/pack.json", "utf8" ) );
const provenance = {
	name: pack.name,
	version: pack.version,
	filename: pack.filename,
	sha256: process.env.PACK_SHA256,
	integrity: pack.integrity,
	shasum: pack.shasum,
	size: pack.size,
	unpackedSize: pack.unpackedSize,
	files: pack.files.map( f => f.path ),
	sourceRepository: "https://github.com/tlouisse/awesome-phonenumber",
	sourceCommit: process.env.PACK_COMMIT,
	libphonenumberVersion: process.env.PACK_LPN,
	buildOutputMatchesCommit: process.env.PACK_BUILD_MATCHES === "true",
	node: process.version,
	npm: require( "child_process" ).execSync( "npm -v" ).toString( ).trim( ),
	createdAt: new Date( ).toISOString( ),
};
fs.writeFileSync(
	process.argv[ 1 ] + "/" + pack.filename.replace( /\.tgz$/, ".provenance.json" ),
	JSON.stringify( provenance, null, 2 ) + "\n"
);
' "$DEST"

PACK_TSC="$STAGE/node_modules/.bin/tsc" node "$ROOT/scripts/verify-pack.mjs" "$TARBALL"

echo "==> $TARBALL"
echo "    sha256 $SHA256"
