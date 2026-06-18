# Lion: abstractions that scale

Features serve two purposes:

- maintainability: 
    - separation of concerns: features run in isolation (not interdependent)
    - familiar naming: align names with current and feature platform specs
    - align names with web comp hosts, choose common denominator fitting both (so open instead of shown, closed instead of hidden). This will make mappings to custom element apis smaller, also reducing cognitive overhead
    - easier to grasp: all code related to a feature is maintained in a small file
    - make the main VisibilityToggleController (previously OverlayController) smaller, modular and readable
    - easier to test in isolation
- performance:
 - on demand loading: only load (and therefore bundle) the features that we need
 - we fall back to platform when possible



