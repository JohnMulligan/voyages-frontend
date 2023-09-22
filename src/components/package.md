# Components

## Factory model

Our components are built on the factory model in order to enable editors to change things like the structure of menus, tables, dropdown selectors, etc. The inputs into these components are laid out in json flatfiles in utils/flatfiles.

## 

All components, in one way or another, interact with the Redux store. This allows, for instance, filter components (like the rangeslider) to update the search filter, which triggers the presentation components (like the table) to make a new query and show updated results. Below is a representation of this communication flow.

![filtercomponentfactory](../documentation_assets/filtercomponentfactory.svg)

## Special cases

The following components have some very specific behavior. We describe how the different typescript files in each of those subfolders work on the following documentation pages:

* ![Cascading Menu Factories](./cascading/package.md)
* ![Filter Component Factories](./FilterComponents/package.md)
* ![Presentation Components](./PresentationComponents/package.md)