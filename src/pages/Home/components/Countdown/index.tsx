import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CyclesContext } from '../../../../contexts/CyclesContext'
import { CountDownContainer, Separetor } from './styles'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    setSecondsPassed,
  } = useContext(CyclesContext)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  // Para reduzir o contdown em 1s - 1s
  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )
        if (secondsDifference >= totalSeconds) {
          // Alterando o ciclo ativo para anotar a data que foi iterrompido
          markCurrentCycleAsFinished()

          setSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          // Só irei atualizar o total de segundos, caso o ciclo não tenha sido concluido
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    setSecondsPassed,
    markCurrentCycleAsFinished,
  ])

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

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

  return (
    <CountDownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separetor>:</Separetor>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountDownContainer>
  )
}
