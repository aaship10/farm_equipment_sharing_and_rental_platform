function Footer() {

  const year = new Date().getFullYear();

  return (
    <footer className="bottom-0 left-0 right-0 bg-purple-200 text-center p-4 mt-4">
      <p>&copy; {year} My Website. All rights reserved.</p>
    </footer>
  );
}

export default Footer;