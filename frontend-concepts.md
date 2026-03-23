# Frontend Architecture & UI Concepts Reference

This document serves as a reference for all the modern React, Tailwind, and Form management concepts we used to build the Authentication and Watchlist/Order modules.

---

## 1. Compound Components (Context API)
We used this pattern to build our `<Tabs>` component. 
You will see syntax like `<Tabs.List>` or `<Tabs.Tab>`. 

### Are these built into React?
No! They are completely custom. In JavaScript, a React Component is just a function, and functions are objects. This means you can attach other components directly to the main component as properties:
```tsx
const Tabs = () => { return <div>...</div> }
Tabs.List = () => { return <div>...</div> }
Tabs.Tab = () => { return <div>...</div> }
```
### Why do we use this?
It allows you to build incredibly clean and organized UI structures:
```tsx
<Tabs>
    <Tabs.List>
        <Tabs.Tab value="BUY">Buy</Tabs.Tab>
    </Tabs.List>
</Tabs>
```
Under the hood, the parent `<Tabs>` component uses React's `createContext` to securely share the `activeTab` state directly with the children (`<Tabs.Tab>`) so you don't have to write messy `active={active}` props everywhere.

---

## 2. Tailwind Z-Index & "Click Outside" Modals
To build the `<Modal>` component with a blurred background that closes when you click outside of it, we used CSS layer stacking.

### `inset-0`
This is a standard Tailwind CSS shortcut that translates to:
```css
top: 0; right: 0; bottom: 0; left: 0;
```
It forces an `absolute` or `fixed` element to stretch perfectly to the borders of the screen. We use this to stretch an invisible `div` across the entire monitor. By attaching `onClick={onClose}` to this invisible stretched layer, clicking anywhere instantly closes the modal!

### `z-50` vs `z-10`
The `z-` classes control the 3D-layering (Z-Index) of HTML elements exactly like Photoshop layers.
- **Layer 0 (Default):** If you give multiple boxes no Z-index, the browser stacks them based on the line of code they are written on. Code written lower down the file sits "on top" of code written higher up.
- **Layer 10 (`z-10`):** We gave the white modal content box `z-10` to guarantee it pops out above the invisible clicking layer (which was Layer 0). This creates a "sandwich" effect!

---

## 3. SVG Graphics vs Images
We use raw `<svg>` code for icons (like the Search magnifying glass or the Modal 'X' button) instead of images (`<img src="..." />`).
- **Crispness:** SVGs are mathematical paths. They never get blurry on high-resolution screens.
- **Tailwind integration:** Because they are pure code, you can use Tailwind classes like `w-5 h-5 text-gray-500 hover:text-blue-500` directly on the `<svg>` to instantly change its color and size!

---

## 4. React Hook Form & Zod
React Hook Form is the library that powers our authentication and order forms, paired closely with `zod` for strict error checking.

### Where do `errors.price` and `errors.quantity` come from?
They are auto-generated! When you pass `zodResolver(orderSchema)` into `useForm`, React Hook Form reads your custom schema. If you defined fields like `price` and `quantity` in Zod, the library magically creates `errors.price` to hold validation errors like "Expected number, received NaN" underneath the hood.

### What is the `<Controller />` wrapper?
Native HTML inputs (`<input />`) are easily managed by React Hook Form using `...register("fieldName")`. 

However, our newly created Custom UI components like `<Dropdown>` or `<QuantityInput>` are not native HTML tags, so `register` breaks. 

**The Solution:** The `<Controller />` acts as a bridge. 
1. You pass it `control` (the state "brain" returned from `useForm()`).
2. You pass it `name` (the field key inside Zod).
3. The controller renders your custom component and passes down `field.value` and `field.onChange` flawlessly linking your custom Dropdowns directly to the global form state!

---

## 5. Remembering React TypeScript Events
When using TypeScript, typing the `e` (Event) object in functions can be confusing:
- `onChange` inside an `<input>` gives a `ChangeEvent<HTMLInputElement>`.
- `onClick` inside a `<button>` gives a `MouseEvent<HTMLButtonElement>`.
- `onScroll` inside a `<div>` gives a `UIEvent<HTMLDivElement>`.

**How do professional developers memorize all this?**
*They don't!* They let the code editor do the heavy lifting using these two tricks:

### Trick 1: The Inline Hover
If you don't know what event type to use, just write it entirely inline first:
```tsx
<input onChange={(e) => console.log(e)} />
```
If you hover your mouse over the `e` inside VS Code, TypeScript will literally pop up and tell you exactly what type it is! You can then copy that type and paste it onto your real function.

### Trick 2: Follow the Property Name
React named their types logically to match the properties you type in HTML:
- If you use `onChange={...}`, it is almost always a `ChangeEvent`.
- If you use `onClick={...}`, it is a `MouseEvent`.
- If you use `onKeyDown={...}`, it is a `KeyboardEvent`.
- If you use `onSubmit={...}`, it is a `FormEvent`.
