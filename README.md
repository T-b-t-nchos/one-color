# One Color
<sub>A color previewer - show one color.</sub>

---

A simple web tool that displays information about a single color.

Enter a color code in the URL and instantly view the color preview, color values, and related information.

## ✨ Features

- Display any HEX color as a full-page background
- Automatic text color selection for readability
- Support multiple color input formats
    - Query parameter
    - Hash parameter
    - Path parameter
- Convert colors into multiple color spaces
    - HEX
    - RGB
    - HSL
    - HSV
    - and more
- Responsive design
- No backend required

## 🚀 Usage

Open one of the following URLs.

- https://one-color.pages.dev/4c8054
- https://one-color.pages.dev/?color=4c8054
- https://one-color.pages.dev/#4c8054

Also, you can use 3-digit color codes. (e.g., `#4c8`)

The page will automatically detect the color and display its information.

## 🎨 Color Input Formats

### Query

`?color=<color>`

Example:

`https://one-color.pages.dev/?color=4c8054`

### Path

`<color>`

Example:

`https://one-color.pages.dev/4c8054`

### Hash

`#<color>`

Example:

`https://one-color.pages.dev/#4c8054`

> [!NOTE]
> Using hash parameters results in some meta information not being set.
> While this does not affect functionality, it is deprecated.

## 🔧 Options

You can use the following options.

### `?hideTitle`

Example:

`https://one-color.pages.dev/?hideTitle#4c8054`

### `?hideDesc`

Example:

`https://one-color.pages.dev/?hideDesc#4c8054`

## 🛠 Development

Clone the repository:

`git clone https://github.com/T-b-t-nchos/one-color.git`

`cd one-color`

Open `index.html` in your browser.

No build system or additional dependencies are required.

> [!CAUTION]
> You can't use path parameters on localhost.
> (e.g., `https://localhost:3000/4c8054`)

## 📦 Technologies

- HTML
- CSS
- JavaScript

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Issues and pull requests are welcome.

If you find a bug or have a feature request, please open an issue.
