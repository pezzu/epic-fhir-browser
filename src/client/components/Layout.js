const Layout = (props) => {
  return (
    <div className="flex justify-center bg-gray-200 h-full min-h-screen">
      {props.children}
    </div>
  )
}

export default Layout;
