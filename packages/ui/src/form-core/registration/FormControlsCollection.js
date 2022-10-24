/* eslint-disable */

/**
 * This class closely mimics the natively
 * supported HTMLFormControlsCollection. It can be accessed
 * both like an array and an object (based on control/element names).
 * @example
 * // This is how a native form works:
 * <form>
 *   <input id="a" name="a">
 *   <fieldset>
 *      <input id="b1" name="b[]">
 *      <input id="b2" name="b[]">
 *      <input id="c" name="c">
 *   </fieldset>
 *   <select id="d" name="d">
 *     <option></option>
 *   </select>
 *   <fieldset>
 *     <input type="radio" id="e1" name="e">
 *     <input type="radio" id="e2" name="e">
 *   </fieldset>
 *   <select id="f" name="f" multiple>
 *     <option></option>
 *   </select>
 *   <fieldset>
 *     <input type="checkbox" id="g1" name="g">
 *     <input type="checkbox" id="g2" name="g">
 *   </fieldset>
 * </form>
 *
 * form.elements[0]; // Element input#a
 * form.elements[1]; // Element input#b1
 * form.elements[2]; // Element input#b2
 * form.elements[3]; // Element input#c
 * form.elements.a;  // Element input#a
 * form.elements.b;  // RadioNodeList<Element> [input#b1, input#b2]
 * form.elements.c;  // input#c
 *
 * // This is how a Lion form works (for simplicity Lion components have the 'l'-prefix):
 * <l-form>
 *  <form>
 *
 *    <!-- fields -->
 *
 *    <l-input id="a" name="a"></l-input>
 *
 *
 *    <!-- field sets ('sub forms') -->
 *
 *    <l-fieldset>
 *      <l-input id="b1" name="b"</l-input>
 *      <l-input id="b2" name="b"></l-input>
 *      <l-input id="c" name="c"></l-input>
 *    </l-fieldset>
 *
 *
 *    <!-- choice groups (children are 'end points') -->
 *
 *    <!-- single selection choice groups -->
 *    <l-select id="d" name="d">
 *      <l-option></l-option>
 *    </l-select>
 *    <l-radio-group id="e" name="e">
 *      <l-radio></l-radio>
 *      <l-radio></l-radio>
 *    </l-radio-group>
 *
 *    <!-- multi selection choice groups -->
 *    <l-select id="f" name="f" multiple>
 *      <l-option></l-option>
 *    </l-select>
 *    <l-checkbox-group id="g" name="g">
 *      <l-checkbox></l-checkbox>
 *      <l-checkbox></l-checkbox>
 *    </l-checkbox-group>
 *
 *  </form>
 * </l-form>
 *
 * lionForm.formElements[0];                  // Element l-input#a
 * lionForm.formElements[1];                  // Element l-input#b1
 * lionForm.formElements[2];                  // Element l-input#b2
 * lionForm.formElements.a;                   // Element l-input#a
 * lionForm.formElements['b[]'];              // Array<Element> [l-input#b1, l-input#b2]
 * lionForm.formElements.c;                   // Element l-input#c
 *
 * lionForm.formElements[d-g].formElements; // Array<Element>
 *
 * lionForm.formElements[d-e].value;          // String
 * lionForm.formElements[f-g].value;          // Array<String>
 */
export class FormControlsCollection extends Array {
  /**
   * @desc Gives back the named keys and filters out array indexes
   * @return {string[]}
   * @protected
   */
  _keys() {
    return Object.keys(this).filter(k => Number.isNaN(Number(k)));
  }
}
