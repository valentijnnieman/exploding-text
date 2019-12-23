# exploding-text

> A React component that renders text with Physics!

[![NPM](https://img.shields.io/npm/v/exploding-text.svg)](https://www.npmjs.com/package/exploding-text) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save exploding-text
```

## Usage

```tsx
import React, { Component } from "react";

import ExplodingText from "exploding-text";

export default class App extends Component {
  render() {
    return (
      <div>
        <ExplodingText
          text={["Example", "Click me!"]}
          lengths={[
            [40, 44, 38, 38, 42, 40, 36],
            [40, 44, 30, 25, 27, 20, 27, 31, 32]
          ]}
          width={800}
          height={600}
          fontSize={64}
          debugDraw={false}
          boundaries={true}
        />
      </div>
    );
  }
}
```

## License

MIT © [valentijnnieman](https://github.com/valentijnnieman)
