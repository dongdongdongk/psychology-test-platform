-- ResultType 테이블을 tests.result_types JSONB로 통합하는 마이그레이션 스크립트
-- 실행 전 데이터 백업 필수!

-- 1. tests 테이블에 result_types JSONB 컬럼 추가
ALTER TABLE tests ADD COLUMN IF NOT EXISTS result_types JSONB;

-- 2. 기존 result_types 테이블의 데이터를 tests.result_types JSONB로 마이그레이션
UPDATE tests 
SET result_types = (
  SELECT jsonb_object_agg(
    rt.type,
    jsonb_build_object(
      'title', rt.title,
      'description', rt.description,
      'image_url', rt.image_url
    )
  )
  FROM result_types rt 
  WHERE rt.test_id = tests.id
)
WHERE EXISTS (
  SELECT 1 FROM result_types rt WHERE rt.test_id = tests.id
);

-- 3. result_types 테이블 삭제
DROP TABLE IF EXISTS result_types;

-- 마이그레이션 완료 확인
-- SELECT id, title, result_types FROM tests WHERE result_types IS NOT NULL LIMIT 1;