import Image from 'next/image'
import appPreviewImg from '../assets/app-nlw.png'
import usersAvatars from '../assets/avatares.png'
import logoImg from '../assets/logo.svg'
import iconCheck from '../assets/icon.svg'
import { GetServerSideProps } from 'next'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

interface HomeProps {
  poolsCount: number;
  guessCount: number;
  usersCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(e: FormEvent) {
    e.preventDefault()

    try {
      const response = await api.post('/pools', {
        title: poolTitle
      })

      const { code } = response.data

      await navigator.clipboard.writeText(code)

      setPoolTitle('')
      alert('Bolão criado com sucesso, o código foi copiado para a área de transferência')
    } catch (error) {
      console.log(error)
      alert('Erro ao criar bolão')
    }
  }

  return (
    <div className='h-screen max-w-[1124px] mx-auto grid grid-cols-2 gap-28 items-center'>
      <main>
        <Image src={logoImg} alt="NLW COPA" />

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatars} alt="avatares" />

          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.usersCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input 
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-white" 
            type="text" 
            placeholder="Qual o nome do seu bolão?" 
            value={poolTitle}
            onChange={e => setPoolTitle(e.target.value)}
          />
          <button className="bg-yellow-500 px-6 py-4 rounded font-bold text-sm text-gray-900 uppercase hover:bg-yellow=700" type="submit">Criar meu bolão</button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">Após criar seu bolão você receberá um código único que poderá usar para convidar outras pessoas</p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">

          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt="check" />
            <div className='flex flex-col'>
              <span className='text-2xl font-bold'>+{props.poolsCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt="check" />
            <div className='flex flex-col'>
              <span className='text-2xl font-bold'>+{props.guessCount}</span>
              <span>Palpites enviados!</span>
            </div>
          </div>
        </div>

      </main>
      
      <Image 
        src={appPreviewImg} 
        alt="dois celulares exibindo uma prévia da aplicação móvel do NLW Copa" 
        quality={100}
      />
    </div>
  )
}


export const getServerSideProps: GetServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, usersCountResponse] = await Promise.all([
    api.get('/pools/count'),
    api.get('/guesses/count'),
    api.get('/users/count'),
  ])

  return {
    props: {
      poolsCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
    }
  }
}

