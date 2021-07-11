[link](https://github.com/css-modules/css-modules)

import css from '!!raw!./GlobalSelectors.css';

.root :global .text {
  color: brown;
  font-size: 24px;
  font-family: helvetica, arial, sans-serif;
  font-weight: 600;
}

.text {
  composes: heading from "shared/styles/typography.css";
  color: blue;
}

