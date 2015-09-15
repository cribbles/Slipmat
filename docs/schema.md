# Schema Information

## records
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
label_id    | integer   | not null, foreign key (references label)
artist_id   | integer   | not null, foreign key (references artist)
title       | string    | not null
cat_no      | integer   | 
country     | string    |
year        | integer   |
image_url   | string    |
notes       | text      |

## artists
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
name        | string    | not null
real_name   | string    |
profile     | text      |

## labels
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
profile     | text      |

## users
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
email           | string    | not null, unique
password_digest | string    | not null
session_token   | string    | not null, unique
profile         | string    |

## comments
column name      | data type | details
-----------------|-----------|-----------------------
id               | integer   | not null, primary key
user_id          | integer   | not null, foreign key (references user)
body             | integer   | not null
commentable_id   | integer   | not null, foreign key
commentable_type | string    | not null, foreign key

## user_collections
column name      | data type | details
-----------------|-----------|-----------------------
id               | integer   | not null, primary key
user_id          | integer   | not null, foreign key (references user)
collections_id   | integer   | not null, foreign key
collections_type | string    | not null, foreign key

## user_contributions
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
user_id     | integer   | not null, foreign key (references user)
record_id   | integer   | not null, foreign key (references record)

## user_activities
column name   | data type | details
--------------|-----------|-----------------------
id            | integer   | not null, primary key
user_id       | integer   | not null, foreign key (references user)
activity_id   | integer   | not null, foreign key
activity_type | string    | not null, foreign key

## genres
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
title       | string    | not null

## styles
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
title       | string    | not null

## genre_tagging
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
genre_id    | integer   | not null, foreign key (references genre)
record_id   | integer   | not null, foreign key (references record)

## style_tagging
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
style_id    | integer   | not null, foreign key (references style)
record_id   | integer   | not null, foreign key (references record)
