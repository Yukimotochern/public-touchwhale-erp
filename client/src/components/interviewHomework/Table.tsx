import React, { useState, useEffect } from 'react'
import './Table.css'

interface Data {
  checked: boolean
  canChecked: boolean
  transpotationState: '00-未派車' | '未派車' | '遺失'
}

interface AppState {
  datas: Data[]
  lastOperation: {
    index: number
    isSelect: boolean
  }
  /**
   * potentially other state, loading, ...
   */
}

const initialData: Data[] = new Array(13).fill(null).map(() => ({
  checked: false,
  canChecked: true,
  transpotationState: '00-未派車',
}))
initialData[1].canChecked = false
initialData[8].canChecked = false
initialData[11].canChecked = false

const initialState: AppState = {
  datas: initialData,
  lastOperation: {
    index: -1,
    isSelect: false,
  },
}

const Checkbox = ({
  checked,
  onCheck,
}: {
  checked: boolean
  onCheck: Function
}) => {
  return <input type='checkbox' checked={checked} onChange={(e) => onCheck()} />
}

const Row = ({ data, onCheck }: { data: Data; onCheck: Function }) => {
  return (
    <tr>
      <td>
        {data.canChecked ? (
          <Checkbox checked={data.checked} onCheck={onCheck} />
        ) : null}
      </td>
      <td className='separate' />
      <td>{data.transpotationState}</td>
    </tr>
  )
}

export const Table = () => {
  const [appState, setAppState] = useState(initialState)
  const [shiftPressing, setShiftPressing] = useState(false)
  useEffect(() => {
    const pressShift = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftPressing(true)
      }
    }
    const releaseShift = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftPressing(false)
      }
    }
    window.addEventListener('keydown', pressShift)
    window.addEventListener('keyup', releaseShift)
    return () => {
      window.removeEventListener('keydown', pressShift)
      window.removeEventListener('keyup', releaseShift)
    }
  }, [shiftPressing])

  const allChecked = (datas: Data[]) =>
    datas.every((data) => !data.canChecked || data.checked)

  const handleClickAll = () => {
    setAppState((pre) =>
      allChecked(pre.datas)
        ? {
            ...pre,
            datas: pre.datas.map((data) =>
              data.canChecked ? { ...data, checked: false } : data
            ),
            lastOperation: {
              index: -1,
              isSelect: false,
            },
          }
        : {
            ...pre,
            datas: pre.datas.map((data) =>
              data.canChecked ? { ...data, checked: true } : data
            ),
            lastOperation: {
              index: -1,
              isSelect: false,
            },
          }
    )
  }

  const handleClickOne = (indToCheck: number) => {
    setAppState((pre) => {
      let dataToCheck = pre.datas[indToCheck]
      if (!dataToCheck || !dataToCheck.canChecked) return pre
      let isRangeAction = shiftPressing && pre.lastOperation.index >= 0
      let isSelectRange =
        isRangeAction && !dataToCheck.checked && pre.lastOperation.isSelect
      let isUnSelectRange =
        isRangeAction && dataToCheck.checked && !pre.lastOperation.isSelect
      let preInd =
        isSelectRange || isUnSelectRange ? pre.lastOperation.index : indToCheck
      let smallerInd = Math.min(indToCheck, preInd)
      let biggerInd = Math.max(indToCheck, preInd)
      return {
        ...pre,
        datas: pre.datas.map((data, ind) => {
          if (!(ind >= smallerInd && ind <= biggerInd && data.canChecked)) {
            return data
          }
          let updatedChecked = !dataToCheck.checked
          if (isUnSelectRange) updatedChecked = false
          if (isSelectRange) updatedChecked = true
          return {
            ...data,
            checked: updatedChecked,
          }
        }),
        lastOperation: dataToCheck.canChecked
          ? {
              index: indToCheck,
              isSelect: !dataToCheck.checked,
            }
          : pre.lastOperation,
      }
    })
  }

  return (
    <table>
      <thead>
        <tr>
          <th>
            <Checkbox
              checked={allChecked(appState.datas)}
              onCheck={handleClickAll}
            />
          </th>
          <th />
          <th className='text'>狀態</th>
        </tr>
      </thead>
      <tbody>
        {appState.datas.map((data, ind) => (
          /**
           *  Assuming ind is the unique id of data.
           *  Can be changed to any id provided by backend
           */
          <Row data={data} key={ind} onCheck={() => handleClickOne(ind)} />
        ))}
      </tbody>
    </table>
  )
}
