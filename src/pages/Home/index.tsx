import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CountDownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separetor,
  StartCountdownButton,
  TaskInput,
} from './styles'
import { useState } from 'react'

// Obj para regras de validação
const newCycleFormValidationScheme = zod.object({
  task: zod.string().min(1, 'Informe a tarefa.'),
  minutesAmount: zod.number().min(5).max(60),
})

// Criando tipagem a partir da referencia do ZOD (newCycleFormValidationScheme) | usando type of pra referencia o javascript dentro do typescript
type NewCyecleFormData = zod.infer<typeof newCycleFormValidationScheme>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  const { register, handleSubmit, watch, reset } = useForm<NewCyecleFormData>({
    resolver: zodResolver(newCycleFormValidationScheme),
    // VAlores iniciais de cada campo
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  function handleCreateNewCycle(data: NewCyecleFormData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
    }

    setCycles((state) => [...state, newCycle])

    // Setando o ciclo recem criado como ciclo ativo
    setActiveCycleId(id)

    // Voltando os campos (resetando) para os valores originais (baseados no defaultValues!)
    reset()
  }

  // Percorrendo o ciclos procurando o ciclo que esta ativo
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  console.log(activeCycle)

  // Observando o campo de task para habilitar/desabilitar o botão de começar!
  const task = watch('task')
  // Var. auxiliar para ficar mais legivel
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            type="text"
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 01" />
            <option value="Projeto 02" />
            <option value="Projeto 03" />
          </datalist>

          <label htmlFor="minutesAmount">durente</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountDownContainer>
          <span>0</span>
          <span>0</span>
          <Separetor>:</Separetor>
          <span>0</span>
          <span>0</span>
        </CountDownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
