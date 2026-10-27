<?php

add_action("acf/init", "my_acfe_modules");
function my_acfe_modules()
{
    // Enable Classic Editor
    acf_update_setting("acfe/modules/classic_editor", true);

    // Enable Force Sync
    acf_update_setting("acfe/modules/force_sync", true);

    // Force Sync Deleted Json: disabled. There is no acf-json folder, and ACFE Pro 0.9.2.6
    // fatals in sync_deleted_field_groups() (in_array on null acfe.autosync) for groups without one.
    acf_update_setting("acfe/modules/force_sync/delete", false);
}

// Coming soon mode (Settings > "Coming soon" tab): visitors who are not logged in
// only see /coming-soon. template_redirect is front-end only, so admin/login/ajax/REST are untouched.
add_action("template_redirect", "coming_soon_redirect");
function coming_soon_redirect()
{
    if (!function_exists("get_field") || !get_field("coming_soon", "option")) {
        return;
    }
    if (is_user_logged_in() || is_page("coming-soon")) {
        return;
    }
    nocache_headers();
    wp_safe_redirect(home_url("/coming-soon/"), 302);
    exit();
}

// Fixes site previews when shared on Discord
add_filter(
    "oembed_response_data",
    "disable_embeds_filter_oembed_response_data_"
);
function disable_embeds_filter_oembed_response_data_($data)
{
    unset($data["author_url"]);
    unset($data["author_name"]);
    return $data;
}

// modify the path to the icons directory
add_filter("acf_icon_path_suffix", "acf_icon_path_suffix");
function acf_icon_path_suffix($path_suffix)
{
    return "views/svgs/";
}
