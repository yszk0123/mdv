# mdv

mdv is a Markdown viewer application that allows you to write and preview Markdown text in real-time. It supports GitHub Flavored Markdown (GFM) and provides a user-friendly interface for editing and viewing Markdown documents.

## Features

- Real-time Markdown preview
- Supports GitHub Flavored Markdown (GFM)
- Easy-to-use text area for Markdown input

## Settings

You can customize the appearance of the Markdown preview by modifying the following settings:

```json
{
  "mdv.parserOptions.customHeader": {
    "heading": "Item ${level}",
    "headingN": ["Item A", "Item B"],
    "unorderedList": "Unordered Item ${level}",
    "orderedList": "Ordered Item ${level}"
  }
}
```

### Markdown

```md
# Item 1
## Item 2
### Item 3
#### Item 4
- [ ] Unordered Item 1
1. Ordered Item 1
2. Ordered Item 2
```

### Table

| Item A | Item B | Item 3 | Item 4 | Unordered Item 1 | Ordered Item 1 | Ordered Item 2 |
| ------ | ------ | ------ | ------ | ---------------- | -------------- | -------------- |
| Item 1 | Item 2 | Item 3 | Item 4 | Unordered Item 1 | Ordered Item 1 | Ordered Item 2 |

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
