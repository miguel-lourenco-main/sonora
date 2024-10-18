# UI - @kit/ui

This package is responsible for managing the UI components and styles across the app.

This package define two sets of components:

- `shadn-ui`: A set of UI components that can be used across the app using shadn UI
- `makerkit`: Components specific to MakerKit

## Installing a Shadcn UI component

To install a Shadcn UI component, you can use the following command in the root of the repository:

```bash
npx shadcn@latest add <component> -c packages/ui
```

For example, to install the `Button` component, you can use the following command:

```bash
npx shadcn-ui@latest add button -c packages/ui
pnpm dlx shadcn-ui@latest add dialog --path=packages/ui/src/shadcn


```

# Dev Tips (Miguel Lourenço)

When adding a new component, check if there is any text that needs to be translated. If so, add the new text to the `ui.json` file in the `src/utils/locales` folder.

For the most part, files in `shadcn` do not `usually` have text that needs to be translated. The same goes for the ui in the `makerkit` folder, assume that it's creator already dealt with that.

(For now) Before running the app, copy the `ui.json` file to the `public/locales` folder of your apps.

In the future, this will be handled automatically.