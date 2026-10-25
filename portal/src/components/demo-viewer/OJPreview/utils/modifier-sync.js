/**
 * @param {*} options
 */
export function getModelSyncedWithDemoDom({ model, modifiers, modifierMappers, demoEl }) {
  const updatedModel = { ...model };

  // Now that we have the model, update our component that we rendered.
  for (const variant of modifiers.variants || []) {
    // @ts-expect-error
    const variantFound = updatedModel.variants.find(v => v.name === variant.name);
    if (variantFound) {
      // @ts-expect-error
      const mapperFound = modifierMappers.find(m => m.name === variant.name);
      variantFound.value = mapperFound?.getter(demoEl, variant.name, {
        variantValues: variant.values,
      });
    }
  }
  for (const state of modifiers.states || []) {
    // @ts-expect-error
    const mapperFound = modifierMappers.find(m => m.name === state);
    const shouldBeActive = mapperFound?.getter(demoEl, state, {});
    // @ts-expect-error
    const stateIdx = updatedModel.states.findIndex(s => s === state);
    if (stateIdx === -1 && shouldBeActive) {
      updatedModel.states.push(state);
    }
  }

  return updatedModel;
}

/**
 * @param {RadioNodeList} radioNodeList
 */
export function getValFromRadioNodeList(radioNodeList) {
  if (radioNodeList[0].type === 'radio') {
    return radioNodeList.value;
  }
  return Array.from(radioNodeList)
    .filter(r => r.checked)
    .map(r => r.value);
}

/**
 * @param {*} options
 */
export function updateModifiersInDemo({ model, modifiers, demoEl, modifierMappers }) {
  // Now that we have the model, update our component that we rendered.
  for (const variant of modifiers.variants || []) {
    // @ts-expect-error
    const variantFound = model.variants.find(v => v.name === variant.name);
    if (variantFound) {
      // @ts-expect-error
      const mapperFound = modifierMappers.find(m => m.name === variant.name);
      mapperFound?.setter(demoEl, variant.name, variantFound.value, {
        variantValues: variant.values,
      });
    }
  }
  for (const state of modifiers.states || []) {
    // @ts-expect-error
    const mapperFound = modifierMappers.find(m => m.name === state);
    mapperFound?.setter(demoEl, state, model.states.includes(state), {});
  }
}
