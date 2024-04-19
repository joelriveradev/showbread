CREATE TABLE sentiments (
  sentiment_id SERIAL PRIMARY KEY,
  sentiment TEXT
);

CREATE TABLE scripture_refs (
  scripture_ref_id SERIAL PRIMARY KEY,
  scripture_ref TEXT
);

CREATE TABLE tags (
  tag_id SERIAL PRIMARY KEY,
  tag TEXT
);

CREATE TABLE featured_quotes (
  featured_quote_id SERIAL PRIMARY KEY,
  featured_quote TEXT
);

CREATE TABLE key_takeaways (
  key_takeaway_id SERIAL PRIMARY KEY,
  key_takeaway TEXT
);

CREATE TABLE summaries (
  summary_id SERIAL PRIMARY KEY,
  summary TEXT
);

CREATE TABLE transcripts (
  transcript_id VARCHAR(255) PRIMARY KEY,
  transcript TEXT,
  confidence FLOAT
);

CREATE TABLE sermons (
  sermon_id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  speaker VARCHAR(255),
  url VARCHAR(255),
  report_id INT UNIQUE,
  transcript_id VARCHAR(255) UNIQUE,
  FOREIGN KEY (report_id) REFERENCES reports(report_id),
  FOREIGN KEY (transcript_id) REFERENCES transcripts(transcript_id)
);

CREATE TABLE reports (
  report_id SERIAL PRIMARY KEY,
  summary_id INT UNIQUE,
  featured_quote_id INT UNIQUE,
  key_takeaway_id INT UNIQUE,
  tag_id INT,
  scripture_ref_id INT,
  sentiment_id INT UNIQUE,
  FOREIGN KEY (summary_id) REFERENCES summaries(summary_id),
  FOREIGN KEY (featured_quote_id) REFERENCES featured_quotes(featured_quote_id),
  FOREIGN KEY (key_takeaway_id) REFERENCES key_takeaways(key_takeaway_id),
  FOREIGN KEY (tag_id) REFERENCES tags(tag_id),
  FOREIGN KEY (scripture_ref_id) REFERENCES scripture_refs(scripture_ref_id),
  FOREIGN KEY (sentiment_id) REFERENCES sentiments(sentiment_id)
);
