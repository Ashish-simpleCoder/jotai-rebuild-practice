import { useSyncExternalStore } from 'react'

interface Atom<AtomType> {
   get: () => AtomType
   set: (newValue: AtomType) => void
   subscribe: (callback: (newValue: AtomType) => void) => () => void
}
type AtomGetter<AtomType> = (get: <TargetAtom>(a: Atom<TargetAtom>) => TargetAtom) => AtomType
type DispatchAtom<AtomType> = (cb: AtomType | ((a: AtomType) => AtomType)) => void

export function atom<AtomType>(initialValue: AtomType | AtomGetter<AtomType>): Atom<AtomType> {
   let value = typeof initialValue == 'function' ? (null as AtomType) : initialValue
   const subscribers = new Set<(newValue: AtomType) => void>()

   const get = <Target,>(atom: Atom<Target>) => {
      let currentValue = atom.get()
      atom.subscribe((newValue) => {
         if (currentValue === newValue) return
         currentValue = newValue
         computeValue()
         subscribers.forEach((cb) => cb(value))
      })
      return currentValue
   }
   const computeValue = () => {
      value = typeof initialValue == 'function' ? (initialValue as AtomGetter<AtomType>)(get) : initialValue
   }
   computeValue()

   return {
      get: () => value,
      set: (newValue) => {
         value = newValue
         subscribers.forEach((callback) => callback(value))
      },
      subscribe: (callback) => {
         subscribers.add(callback)
         return () => subscribers.delete(callback)
      },
   }
}

export function useAtom<AtomType>(atom: Atom<AtomType>): [AtomType, DispatchAtom<AtomType>] {
   const setter: DispatchAtom<AtomType> = (cb) => {
      if (typeof cb == 'function') {
         const val = (cb as (a: AtomType) => AtomType)(atom.get())
         atom.set(val)
      } else {
         atom.set(cb)
      }
   }
   return [useSyncExternalStore(atom.subscribe, atom.get), setter]
}
export function useAtomValue<AtomType>(atom: Atom<AtomType>): AtomType {
   return useSyncExternalStore(atom.subscribe, atom.get)
}
