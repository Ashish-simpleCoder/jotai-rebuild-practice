import { atom, useAtom, useAtomValue } from './jotai'

const salaryAtom = atom(100_000)
const bonusAtom = atom(100_0)
const totalSalaryAtom = atom((get) => get(salaryAtom) + get(bonusAtom))
const userAtom = atom({ name: 'Coder', age: 1000 })

export default function App() {
   const [salary, setSalary] = useAtom(salaryAtom)
   const [bonus, setBonus] = useAtom(bonusAtom)
   const totalSalary = useAtomValue(totalSalaryAtom)

   return (
      <>
         <div>
            <div>
               <input value={salary} onChange={(e) => setSalary(+e.target.value)} />
            </div>
            <DisplaySalary />

            <hr />

            <div>
               <input value={bonus} onChange={(e) => setBonus(+e.target.value)} />
            </div>
            <DisplayBonus />
            {totalSalary}

            <hr />
            <User />
         </div>
      </>
   )
}

function DisplaySalary() {
   const salary = useAtomValue(salaryAtom)
   return <div>Salary: {salary}</div>
}
function DisplayBonus() {
   const bonus = useAtomValue(bonusAtom)
   return <div>Salary: {bonus}</div>
}
function User() {
   return (
      <>
         <h3>User Atom</h3>
         <Name />
         <br />
         <Age />
      </>
   )
}

function Name() {
   const [{ name }, setUser] = useAtom(userAtom)

   return (
      <>
         <div>
            <input value={name} onChange={(e) => setUser((s) => ({ ...s, name: e.target.value }))} />
         </div>
         <div>name: {name}</div>
      </>
   )
}
function Age() {
   const age = useAtomValue(userAtom).age

   return <div>age: {age}</div>
}
