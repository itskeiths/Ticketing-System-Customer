import Image from 'next/image'
import Register from './authentication/register/page'
import Login from './authentication/signin/page'
import Dashboard from './dashboard/page'
import Main from './Main_page/page'

export default function Home() {
  return (
   <main>
    <Login/>
   </main>
  )
}
