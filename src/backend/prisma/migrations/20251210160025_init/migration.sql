-- CreateTable
CREATE TABLE "habits_table" (
    "id" BIGSERIAL NOT NULL,
    "habit_name" VARCHAR,
    "father_id" BIGINT,
    "description" TEXT,
    "start_date" DATE,
    "streak" BIGINT,
    "last_break" DATE,
    "user_id" UUID,
    "last_checked" TIMESTAMPTZ(6),
    "prev_last_checked" TIMESTAMPTZ[],

    CONSTRAINT "habits_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR,
    "streak_duration" BIGINT,
    "streak_freezes" BIGINT,
    "food_points" BIGINT,
    "recovery_on" BOOLEAN,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
