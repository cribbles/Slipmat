# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150919131859) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "artists", force: :cascade do |t|
    t.string   "name",       null: false
    t.string   "real_name"
    t.text     "profile"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "artists", ["name"], name: "index_artists_on_name", unique: true, using: :btree

  create_table "comments", force: :cascade do |t|
    t.integer  "author_id"
    t.text     "body",             null: false
    t.integer  "commentable_id"
    t.string   "commentable_type"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  add_index "comments", ["author_id"], name: "index_comments_on_author_id", using: :btree
  add_index "comments", ["commentable_type", "commentable_id"], name: "index_comments_on_commentable_type_and_commentable_id", using: :btree

  create_table "countries", force: :cascade do |t|
    t.string   "code",       null: false
    t.string   "name",       null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "labels", force: :cascade do |t|
    t.string   "title",      null: false
    t.text     "profile"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "labels", ["title"], name: "index_labels_on_title", unique: true, using: :btree

  create_table "records", force: :cascade do |t|
    t.string   "title",      null: false
    t.string   "cat_no"
    t.integer  "year"
    t.string   "image_url"
    t.text     "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "artist_id",  null: false
    t.integer  "label_id"
    t.integer  "country_id"
  end

  add_index "records", ["artist_id"], name: "index_records_on_artist_id", using: :btree
  add_index "records", ["country_id"], name: "index_records_on_country_id", using: :btree
  add_index "records", ["label_id"], name: "index_records_on_label_id", using: :btree

  create_table "tracks", force: :cascade do |t|
    t.integer  "record_id",  null: false
    t.string   "title",      null: false
    t.string   "duration"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "tracks", ["record_id"], name: "index_tracks_on_record_id", using: :btree

  create_table "user_collections", force: :cascade do |t|
    t.integer  "user_id",    null: false
    t.integer  "record_id",  null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "user_collections", ["record_id"], name: "index_user_collections_on_record_id", using: :btree
  add_index "user_collections", ["user_id", "record_id"], name: "index_user_collections_on_user_id_and_record_id", unique: true, using: :btree
  add_index "user_collections", ["user_id"], name: "index_user_collections_on_user_id", using: :btree

  create_table "user_contributions", force: :cascade do |t|
    t.integer  "user_id",    null: false
    t.integer  "record_id",  null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "user_contributions", ["record_id"], name: "index_user_contributions_on_record_id", using: :btree
  add_index "user_contributions", ["user_id", "record_id"], name: "index_user_contributions_on_user_id_and_record_id", unique: true, using: :btree
  add_index "user_contributions", ["user_id"], name: "index_user_contributions_on_user_id", using: :btree

  create_table "user_wants", force: :cascade do |t|
    t.integer  "user_id",    null: false
    t.integer  "record_id",  null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "user_wants", ["record_id"], name: "index_user_wants_on_record_id", using: :btree
  add_index "user_wants", ["user_id", "record_id"], name: "index_user_wants_on_user_id_and_record_id", unique: true, using: :btree
  add_index "user_wants", ["user_id"], name: "index_user_wants_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "username",        null: false
    t.string   "email",           null: false
    t.string   "password_digest", null: false
    t.string   "session_token",   null: false
    t.string   "location"
    t.string   "url"
    t.text     "profile"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["session_token"], name: "index_users_on_session_token", unique: true, using: :btree
  add_index "users", ["username"], name: "index_users_on_username", unique: true, using: :btree

end
