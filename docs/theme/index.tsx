import Theme from "rspress/theme";
import "./styles.css";

const Layout = () => <Theme.Layout />;

export default {
  ...Theme,
  Layout,
};

export * from "rspress/theme";
