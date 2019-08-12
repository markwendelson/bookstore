'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { request, response }) {
    if (error.code == 'E_PASSWORD_MISMATCH') {
      return response.json({
        message: 'Password mismatch.',
        status: 'error',
      })
    }
    else if (error.code == 'E_USER_NOT_FOUND') {
      return response.json({
        message: 'Account not found.',
        status: 'error',
      })
    }
    else if(error.code == 'E_GUEST_ONLY') {
      return response.route('page.index')
    }
    else if(error.code == 'E_ROUTE_NOT_FOUND') {
      return response.route('page.notFound')
    }
    else if(error.code =='E_MISSING_DATABASE_ROW') {
      return response.route('page.notFound')
    }
    else {
      response.status(error.status).send(error.message)
    }
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {
  }
}

module.exports = ExceptionHandler
