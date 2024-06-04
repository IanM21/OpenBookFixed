"use client"

// import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

import styles from './menuLink.module.css';

type Item = {
  item: {
  title: string,
  path: string,
  icon: JSX.Element 
  }
}

const MenuLink = ({item}: Item) => {

  // const pathname = usePathname()
  const pathname = useRouter();
  console.log(pathname)

  // const goTo = ({link}) => {
  //   location.href = link
  // }
  async function navigateTo(path: string) {
    pathname.push(path);
  }

  return (
    // <div onClick={() => location.href=item.path } className={`${styles.container} ${pathname === item.path && styles.active}`}>
    <div onClick={(e) => {
      e.preventDefault()
      navigateTo(item.path)
    }} 
    className={`${styles.container} ${pathname === item.path && styles.active}`}>
    {/* <Link href={item.path}> */}
       {item.icon}
       {item.title}
      {/* </Link> */}
    </div>
  )
}

export default MenuLink