-- 데이터베이스 구조 개선 마이그레이션 스크립트
-- 실행 전 데이터 백업 필수!

-- 0. questions 컬럼이 없다면 추가
ALTER TABLE tests ADD COLUMN IF NOT EXISTS questions JSONB;

-- 1. 기존 Question과 AnswerOption 데이터를 Test.questions JSONB로 마이그레이션
UPDATE tests 
SET questions = (
  SELECT json_agg(
    json_build_object(
      'id', q.id,
      'content', q.content,
      'order', q."order",
      'type', q.type,
      'options', (
        SELECT json_agg(
          json_build_object(
            'content', ao.content,
            'value', ao.value::json,  -- value를 JSON으로 파싱 ({"A":-1,"B":3} 형태)
            'order', ao."order"
          ) ORDER BY ao."order"
        )
        FROM answer_options ao 
        WHERE ao.question_id = q.id
      )
    ) ORDER BY q."order"
  )
  FROM questions q 
  WHERE q.test_id = tests.id
)
WHERE EXISTS (
  SELECT 1 FROM questions q WHERE q.test_id = tests.id
);

-- 2. 기존 테이블 삭제 (외래키 제약조건 때문에 순서 중요)
DROP TABLE IF EXISTS answer_options;
DROP TABLE IF EXISTS questions;

-- 3. 백업 테이블 삭제
DROP TABLE IF EXISTS user_responses_backup;

-- 마이그레이션 완료 확인
-- SELECT id, title, questions FROM tests WHERE questions IS NOT NULL LIMIT 1;