
module.exports = {
  plugins: {
    "postcss-preset-env": {},
    "css-mqpacker": {},
    cssnano: {
      preset: [
        "default",
        {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    },

  },
};
