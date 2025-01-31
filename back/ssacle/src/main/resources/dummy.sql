INSERT INTO `Category` (`id`, `parent_id`, `category_name`, `is_leaf`, `image`)
VALUES (1, NULL, 'WebRTC', TRUE, NULL);

INSERT INTO `Sprint` (
    `id`, `category_id`, `ssaldcup_id`, `name`, `description`, `started_at`, `end_at`, `prsentation`, `recruit`, `participation`, `detail_topic`, `created_at`, `sequence`, `tag`
) VALUES (
    1, 1, null, 'WebRTC Sprint', 'WebRTC 기반 화상 회의 테스트',
    '2024-02-01 10:00:00', '2024-02-15 18:00:00', '2024-02-15 15:00:00',
    10, 5, 'WebRTC 실습 및 실시간 회의 구현',
    NOW(), 1, 'WebRTC, STOMP, 실시간'
);