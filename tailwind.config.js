import fluid, { extract } from "fluid-tailwind";

export default {
  content: {
    files: [
      "./app/**/*.{vue,ts}",
      "./components/**/*.{vue,ts}",
      "./layouts/**/*.{vue,ts}",
      "./pages/**/*.{vue,ts}",
      "./node_modules/shadcn-vue/**/*.{vue,js,ts}",
    ],
    extract,
  },
  plugins: [fluid],
};
