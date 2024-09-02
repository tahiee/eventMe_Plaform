import Image from "next/image"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
        <Link href={'/'}>
        <Image width={128} height={38} alt="logo" src={'/assets/images/logo2.png'}/>
        </Link>
      <p>2024 EventMe. All Rights Reserved</p>
      </div>
    </footer>
  )
}

export default Footer