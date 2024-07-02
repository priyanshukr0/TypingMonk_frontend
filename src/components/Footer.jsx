const Footer = () => {
  const footerNavs = [
    {
      href: "javascript:void()",
      name: "Terms",
    },
    {
      href: "javascript:void()",
      name: "License",
    },
    {
      href: "javascript:void()",
      name: "Privacy",
    },
    {
      href: "javascript:void()",
      name: "About us",
    },
  ];
  return (

    <div className="max-w-screen-xl px-4 mx-auto text-gray-600 md:px-8">
      <div className="items-center justify-between py-10 mt-0 border-t sm:flex">
        <p>© 2022 Float UI Inc. All rights reserved.</p>
        <ul className="flex flex-wrap items-center gap-4 mt-6 sm:text-sm sm:mt-0">
          {footerNavs.map((item, idx) => (
            <li className="text-gray-200 duration-150 hover:text-gray-500">
              <a key={idx} href={item.href}>
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>

  );
};
export default Footer;
