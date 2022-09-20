import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { differenceInSeconds } from 'date-fns'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { useEffect, useState } from 'react'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  // Percorrendo o ciclos procurando o ciclo que esta ativo
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  function handleCreateNewCycle(data: NewCyecleFormData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])

    // Setando o ciclo recem criado como ciclo ativo
    setActiveCycleId(id)

    // Voltando para quantos segundos se passaram
    setAmountSecondsPassed(0)

    // Voltando os campos (resetando) para os valores originais (baseados no defaultValues!)
    reset()
  }

  function handleInterruptCycle() {
    // Alterando o ciclo ativo para anotar a data que foi iterrompido
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )

    // Acabando com o ciclo ativo
    setActiveCycleId(null)
  }

  // Arredondando sempre pra baixo
  const minutesAmount = Math.floor(currentSeconds / 60)

  // Capturando o quanto resta de 60s (quantos s sobre que não cabem em uma divisão)
  const secondsAmount = currentSeconds % 60

  // Metodo para preencher uma string para preencher uma string para um tamanho especifico com algum caracter
  const minutes = String(minutesAmount).padStart(2, '0') // Sempre é pra ter 2 caracteres, caso não tenha, inclui o "0" antes do dig.
  const seconds = String(secondsAmount).padStart(2, '0')

  // Atualizando titulo da pagina quando atualizar o timer
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  // Observando o campo de task para habilitar/desabilitar o botão de começar!
  const task = watch('task')
  // Var. auxiliar para ficar mais legivel
  const isSubmitDisabled = !task

  console.log(cycles)

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <NewCycleForm />
        <Countdown
          activeCycle={activeCycle}
          setCycles={setCycles}
          activeCycleId={activeCycleId}
        />

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
