const ast = {
  kind: 'MachineVariable',
  name: 'machine',
  definition: {
    kind: 'MachineDefinition',
    config: {
      kind: 'MachineConfig',
      id: {
        kind: 'Id',
        value: 'toggle',
      },
      initial: {
        kind: 'Initial',
        value: 'active',
      },
      states: {
        kind: 'States',
        states: [
          {
            kind: 'State',
            key: 'active',
            entry: {
              kind: 'Entry',
              isArray: false,
              actions: [
                {
                  kind: 'ActionObject',
                  type: 'activate',
                },
              ],
            },
            exit: {
              kind: 'Exit',
              isArray: false,
              actions: [
                {
                  kind: 'ActionObject',
                  type: 'deactivate',
                },
              ],
            },
            on: {
              kind: 'On',
              transitions: [
                {
                  kind: 'Transition',
                  key: 'toggle',
                  isArray: false,
                  entries: [
                    {
                      kind: 'TransitionConfig',
                      target: 'inactive',
                      actions: {
                        kind: 'TransitionActions',
                        isArray: true,
                        entries: [
                          {
                            kind: 'ActionObject',
                            type: 'notify',
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            kind: 'State',
            key: 'inactive',
            on: {
              kind: 'On',
              transitions: [
                {
                  kind: 'Transition',
                  key: 'toggle',
                  isArray: false,
                  entries: [
                    {
                      type: 'TransitionConfig',
                      target: 'active',
                      actions: {
                        kind: 'TransitionActions',
                        isArray: true,
                        entries: [
                          {
                            kind: 'ActionObject',
                            type: 'notify',
                            params: {
                              kind: 'ActionObjectParams',
                              entries: [
                                {
                                  kind: 'ActionObjectParam',
                                  key: 'message',
                                  value: 'Some notification',
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
  },
};

const machine = createMachine({
  id: 'toggle',
  initial: 'active',
  states: {
    active: {
      entry: { type: 'activate' },
      exit: { type: 'deactivate' },
      on: {
        toggle: {
          target: 'inactive',
          actions: [{ type: 'notify' }],
        },
      },
    },
    inactive: {
      on: {
        toggle: {
          target: 'active',
          actions: [
            // action with params
            {
              type: 'notify',
              params: {
                message: 'Some notification',
              },
            },
          ],
        },
      },
    },
  },
});
