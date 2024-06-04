"use client"

// import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

import styles from './menuLink.module.css';

// type Item = {
//   title: any,
//   path: any,
//   icon: any
// }

const MenuLink = ({item}) => {

  // const pathname = usePathname()
  const pathname = useRouter();
  console.log(pathname)

  // const goTo = ({link}) => {
  //   location.href = link
  // }

  return (
    <div onClick={() => location.href=item.path } className={`${styles.container} ${pathname === item.path && styles.active}`}>
      {/* <Link href={item.path}> */}
       {item.icon}
       {item.title}
      {/* </Link> */}
    </div>
  )
}

export default MenuLink