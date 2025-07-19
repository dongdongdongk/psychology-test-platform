-- UserResponse 테이블 구조 개선 마이그레이션 스크립트
-- 실행 전 데이터 백업 필수!

-- 1. 기존 데이터를 새로운 JSONB 구조로 변환
UPDATE user_responses 
SET response_data = jsonb_build_object(
  'answers', response_data,  -- 기존 response_data를 answers 필드로 이동
  'metadata', jsonb_build_object(
    'start_time', created_at::text,
    'completion_time', created_at::text,
    'browser_info', COALESCE(user_agent, ''),
    'device_type', CASE 
      WHEN user_agent LIKE '%Mobile%' THEN 'mobile' 
      ELSE 'desktop' 
    END,
    'total_questions', 0  -- 기본값, 실제 테스트 데이터에 따라 조정 필요
  )
)
WHERE response_data IS NOT NULL;

-- 2. total_score 컬럼 제거 (JSONB에서 계산하도록 변경)
ALTER TABLE user_responses DROP COLUMN IF EXISTS total_score;

-- 3. updated_at 컬럼 추가
ALTER TABLE user_responses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. updated_at 트리거 생성 (자동 업데이트)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. 트리거 적용
DROP TRIGGER IF EXISTS update_user_responses_updated_at ON user_responses;
CREATE TRIGGER update_user_responses_updated_at
    BEFORE UPDATE ON user_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. 인덱스 최적화
CREATE INDEX IF NOT EXISTS idx_user_responses_session_id ON user_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_user_responses_result_type ON user_responses(result_type);
CREATE INDEX IF NOT EXISTS idx_user_responses_created_at ON user_responses(created_at);

-- 마이그레이션 완료 확인
-- SELECT id, test_id, result_type, response_data->'metadata' as metadata FROM user_responses LIMIT 3;