import { ResultData } from '@/hooks/useTestResult'
import styles from './ResultImages.module.scss'

interface ResultImagesProps {
  resultData: ResultData
}

export default function ResultImages({ resultData }: ResultImagesProps) {
  // 이미지가 하나도 표시되지 않는 경우 컴포넌트를 렌더링하지 않음
  if (!resultData.showResultImage && !resultData.showTextImage) {
    return null
  }

  return (
    <div className={styles.imagesContainer}>
      {resultData.showResultImage && (
        <img 
          src={resultData.imageUrl || '/placeholder-result.jpg'} 
          alt="결과 이미지"
          className={styles.mainResultImage}
        />
      )}
      
      {resultData.showTextImage && resultData.textImageUrl && (
        <img 
          src={resultData.textImageUrl} 
          alt="결과 텍스트 이미지"
          className={styles.textResultImage}
        />
      )}
    </div>
  )
}