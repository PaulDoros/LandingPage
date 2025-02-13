alter table landing_pages
  add column layout_settings jsonb default jsonb_build_object(
    'useGap', true,
    'gapSize', 8,
    'useContainer', true,
    'containerPadding', 16
  );

comment on column landing_pages.layout_settings is 'Layout settings for the landing page, including gap and container settings'; 