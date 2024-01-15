import { css } from 'lit';

export default css`
  [data-part='root'] {
    --_img-placeholder-color: #e8f3fa;

    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 0;
    margin-bottom: 16px;
  }

  [data-part='image'] {
    border-radius: inherit;
    background-color: var(--_img-placeholder-color);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  [data-part='root'][data-img-placement='left'],
  [data-part='root'][data-img-placement='right'] {
    flex-direction: row;
  }

  [data-part='root'][data-img-placement='bottom'] [data-part='image'],
  [data-part='root'][data-img-placement='top'] [data-part='image'] {
    min-height: 240px;
  }

  [data-part='root'][data-img-placement='left'] [data-part='image'],
  [data-part='root'][data-img-placement='right'] [data-part='image'] {
    min-width: 50%;
  }

  [data-part='body'] ::slotted([slot='heading']) {
    text-transform: capitalize;
    font-weight: bold;
  }

  [data-part='body'] {
    padding-top: 32px;
  }

  [data-part='anchor'] {
    position: absolute;
    inset: 0;
  }

  [data-part='root']:hover {
    /* box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12),
      0 5px 5px -3px rgba(0, 0, 0, 0.2); */
    transform: scale(1.02);
    transition: transform 0.1s;
  }

  /* [data-part='anchor']:focus {
    outline: none;
    box-shadow: 0 0 8px var(--_sky_400), 0 0 0 1px var(--_sky_500);
  } */

  @container (min-width: 480px) {
    [data-part='root'],
    [data-part='anchor']:focus {
      border-radius: 4px;
    }

    [data-part='root'][data-img-placement='top'] [data-part='image'] {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    [data-part='root'][data-img-placement='bottom'] [data-part='image'] {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    [data-part='root'][data-img-placement='left'] [data-part='image'] {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    [data-part='root'][data-img-placement='right'] [data-part='image'] {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }

  @container (min-width: 720px) {
    [data-part='body'] {
      padding-block: 24px;
    }
  }
`;
