import {APP_NAME, APP_VERSION} from "../config";

export default function Footer() {
  return (
    <footer className="text-sm text-gray-500 text-center p-4">
      {APP_NAME} v{APP_VERSION}
    </footer>
  );
}
