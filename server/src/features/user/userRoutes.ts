import express from 'express'
import passport from 'passport'
import {
  userOAuthCallback,
  userSignIn,
  userSignUp,
  userVerify,
  userSignOut,
  getUser,
  updateUser,
  userGetAvatarUploadUrl,
  deleteAvatar,
  changePassword,
  forgetPassword,
  resetPassword,
  getWorkers,
  getWorker,
  createWorker,
  updateWorker,
  deleteWorker,
} from './userControllers'

// Middleware
import auth from '../../middlewares/authMiddleware'
import errorCatcher from '../../middlewares/errorCatcher'
import { permission } from '../../middlewares/permission/permissionMiddleware'

const router = express.Router()

router.route('/signUp').post(errorCatcher(userSignUp))

router.route('/signUp/verify').post(errorCatcher(userVerify))

router.route('/signIn').post(errorCatcher(userSignIn))

router.route('/signUp/setPassword').post(auth, errorCatcher(changePassword)) // Use changePassword to implement new user setPassword

router
  .route('/googleOAuth')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }))

router.route('/googleOAuth/callback').get(
  passport.authenticate('google', {
    failureRedirect:
      process.env.NODE_ENV === 'production'
        ? '/signIn'
        : `${process.env.FRONTEND_DEV_URL}signIN`,
  }), //failureRedirect need to be changed
  errorCatcher(userOAuthCallback)
)

router.route('/signOut').get(errorCatcher(userSignOut))

router
  .route('/')
  .get(auth, errorCatcher(getUser))
  .put(auth, errorCatcher(updateUser))

router
  .route('/avatar')
  .get(auth, errorCatcher(userGetAvatarUploadUrl))
  .delete(auth, errorCatcher(deleteAvatar))

router.route('/changePassword').put(auth, errorCatcher(changePassword))

router
  .route('/forgetPassword')
  .post(errorCatcher(forgetPassword))
  .put(errorCatcher(resetPassword))

router
  .route('/workers')
  .all(auth)
  .get(permission(['user.get_workers']), getWorkers)

router
  .route('/workers/:id')
  .all(auth)
  .get(permission(['user.get_worker']), getWorker)
  .post(permission(['user.create_worker']), createWorker)
  .put(permission(['user.update_worker']), updateWorker)
  .delete(permission(['user.delete_worker']), deleteWorker)

export default router
