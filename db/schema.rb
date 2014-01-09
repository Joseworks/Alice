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

ActiveRecord::Schema.define(version: 20140109164535) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "comments", force: true do |t|
    t.integer  "post_id",      null: false
    t.string   "author",       null: false
    t.string   "author_url",   null: false
    t.string   "author_email", null: false
    t.text     "body",         null: false
    t.text     "body_html",    null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "comments", ["created_at"], name: "index_comments_on_created_at", using: :btree
  add_index "comments", ["post_id"], name: "index_comments_on_post_id", using: :btree

  create_table "impressions", force: true do |t|
    t.string   "impressionable_type"
    t.integer  "impressionable_id"
    t.integer  "user_id"
    t.string   "controller_name"
    t.string   "action_name"
    t.string   "view_name"
    t.string   "request_hash"
    t.string   "ip_address"
    t.string   "session_hash"
    t.text     "message"
    t.text     "referrer"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "impressions", ["controller_name", "action_name", "ip_address"], name: "controlleraction_ip_index", using: :btree
  add_index "impressions", ["controller_name", "action_name", "request_hash"], name: "controlleraction_request_index", using: :btree
  add_index "impressions", ["controller_name", "action_name", "session_hash"], name: "controlleraction_session_index", using: :btree
  add_index "impressions", ["impressionable_type", "impressionable_id", "ip_address"], name: "poly_ip_index", using: :btree
  add_index "impressions", ["impressionable_type", "impressionable_id", "request_hash"], name: "poly_request_index", using: :btree
  add_index "impressions", ["impressionable_type", "impressionable_id", "session_hash"], name: "poly_session_index", using: :btree
  add_index "impressions", ["impressionable_type", "message", "impressionable_id"], name: "impressionable_type_message_index", using: :btree
  add_index "impressions", ["user_id"], name: "index_impressions_on_user_id", using: :btree

  create_table "open_id_authentication_associations", force: true do |t|
    t.integer "issued"
    t.integer "lifetime"
    t.string  "handle"
    t.string  "assoc_type"
    t.binary  "server_url"
    t.binary  "secret"
  end

  create_table "open_id_authentication_nonces", force: true do |t|
    t.integer "timestamp",  null: false
    t.string  "server_url"
    t.string  "salt",       null: false
  end

  create_table "pages", force: true do |t|
    t.string   "title",      null: false
    t.string   "slug",       null: false
    t.text     "body",       null: false
    t.text     "body_html",  null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "pages", ["created_at"], name: "index_pages_on_created_at", using: :btree
  add_index "pages", ["slug"], name: "pages_slug_unique_idx", using: :btree
  add_index "pages", ["title"], name: "index_pages_on_title", using: :btree

  create_table "posts", force: true do |t|
    t.string   "title",                                              null: false
    t.string   "slug",                                               null: false
    t.text     "body",                                               null: false
    t.text     "body_html",                                          null: false
    t.boolean  "active",                  default: true,             null: false
    t.integer  "approved_comments_count", default: 0,                null: false
    t.text     "cached_tag_list"
    t.datetime "published_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "edited_at",                                          null: false
    t.text     "intro_text"
    t.text     "intro_text_html"
    t.string   "author",                  default: "Quidnunc Staff"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.string   "source_link",             default: ""
    t.datetime "ready_for_review"
    t.string   "source_link_description"
    t.string   "caption"
    t.integer  "impressions_count",       default: 0
  end

  add_index "posts", ["published_at"], name: "index_posts_on_published_at", using: :btree
  add_index "posts", ["slug"], name: "posts_slug_unique_idx", using: :btree

  create_table "sessions", force: true do |t|
    t.string   "session_id", null: false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], name: "index_sessions_on_session_id", using: :btree
  add_index "sessions", ["updated_at"], name: "index_sessions_on_updated_at", using: :btree

  create_table "taggings", force: true do |t|
    t.integer  "tag_id"
    t.integer  "taggable_id"
    t.datetime "created_at"
    t.string   "taggable_type"
    t.string   "context"
    t.integer  "tagger_id"
    t.string   "tagger_type"
  end

  add_index "taggings", ["tag_id"], name: "index_taggings_on_tag_id", using: :btree
  add_index "taggings", ["taggable_id"], name: "index_taggings_on_taggable_id_and_taggable_type", using: :btree

  create_table "tags", force: true do |t|
    t.string  "name"
    t.integer "taggings_count", default: 0, null: false
  end

  add_index "tags", ["name"], name: "index_tags_on_name", using: :btree

  create_table "undo_items", force: true do |t|
    t.string   "type",       null: false
    t.datetime "created_at", null: false
    t.text     "data"
  end

  add_index "undo_items", ["created_at"], name: "index_undo_items_on_created_at", using: :btree

  create_table "users", force: true do |t|
    t.string   "name",       null: false
    t.string   "email",      null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "provider"
    t.string   "uid"
    t.string   "role"
  end

end
