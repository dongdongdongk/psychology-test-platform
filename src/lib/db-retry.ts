import { PrismaClientKnownRequestError, PrismaClientInitializationError } from '@prisma/client/runtime/library'

export async function retryDbOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      // 데이터베이스 연결 오류 처리
      const isConnectionError = (
        (error instanceof PrismaClientKnownRequestError && error.code === 'P1001') ||
        (error instanceof PrismaClientInitializationError && error.message.includes("Can't reach database server"))
      )
      
      if (isConnectionError) {
        if (i < maxRetries - 1) {
          console.log(`Database connection failed, retrying in ${delayMs}ms... (${i + 1}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, delayMs))
          delayMs *= 2 // 지수 백오프
          continue
        }
      }
      
      throw error
    }
  }
  
  throw lastError!
}