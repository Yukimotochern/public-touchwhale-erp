import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { MainLayout } from './layout/mainLayout/MainLayout'
import { HomePage } from './pages/home/HomePage'

export const appRoutesStructure = []

export const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route
          path='/'
          element={
            <MainLayout tabbed={false}>
              <HomePage />
            </MainLayout>
          }
        />
        <Route path='/uu' element={<MainLayout tabbed={false} />}></Route>
      </Routes>
    </>
  )
}
