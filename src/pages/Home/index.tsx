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

// Obj para regras de validação
const newCycleFormValidationScheme = zod.object({
  task: zod.string().min(1, 'Informe a tarefa.'),
  minutesAmount: zod.number().min(5).max(60),
})

// Criando tipagem a partir da referencia do ZOD (newCycleFormValidationScheme) | usando type of pra referencia o javascript dentro do typescript
type NewCyecleFormData = zod.infer<typeof newCycleFormValidationScheme>

export function Home() {
  const { register, handleSubmit, watch } = useForm<NewCyecleFormData>({
    resolver: zodResolver(newCycleFormValidationScheme),
    // VAlores iniciais de cada campo
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  function handleCreateNewCycle(data: NewCyecleFormData) {
    console.log(data)
  }

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
