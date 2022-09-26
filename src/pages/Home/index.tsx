import { HandPalm, Play } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { useContext } from 'react'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import { CyclesContext } from '../../contexts/CyclesContext'

// Obj para regras de validação
const newCycleFormValidationScheme = zod.object({
  task: zod.string().min(1, 'Informe a tarefa.'),
  minutesAmount: zod.number().min(5).max(60),
})

// Criando tipagem a partir da referencia do ZOD (newCycleFormValidationScheme) | usando type of pra referencia o javascript dentro do typescript
type NewCyecleFormData = zod.infer<typeof newCycleFormValidationScheme>

export function Home() {
  const { createNewCycle, interruptCurrentCycle, activeCycle } =
    useContext(CyclesContext)

  const newCycleForm = useForm<NewCyecleFormData>({
    resolver: zodResolver(newCycleFormValidationScheme),
    // VAlores iniciais de cada campo
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCyecleFormData) {
    // Voltando os campos (resetando) para os valores originais (baseados no defaultValues!)
    createNewCycle(data)
    reset()
  }

  // Observando o campo de task para habilitar/desabilitar o botão de começar!
  const task = watch('task')
  // Var. auxiliar para ficar mais legivel
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />
        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
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
