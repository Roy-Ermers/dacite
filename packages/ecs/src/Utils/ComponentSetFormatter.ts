import ComponentSet from "../Components/ComponentSet";

window.devtoolsFormatters = [
  {
    header: variable => {
      if (variable instanceof ComponentSet) {
        return [
          'div',
          {
            style: "color: lime"
          },
          `${variable.constructor.name} (${variable.toArray().length})`
        ]
      }

      return null;
    },
    hasBody: variable => variable instanceof ComponentSet,
    body: variable => {
      if (!(variable instanceof ComponentSet)) {
        return null;
      }
      const items = variable.toArray();
      return [
        'ol',
        {},
        ...items.map(item => ['li', {}, ["object", { object: item, config: { level: 0 } }]])
      ];
    }
  }
];
