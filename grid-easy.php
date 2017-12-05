<?php
/*
 * Plugin Name: Grid Easy
 * Author: Tejasvi Karne
 * Author URI: https://wordpress.stackexchange.com/users/123929/tejasvi-karne
 * Description: Just check out your post edit page.
 * Text Domain: grid-easy
 */
add_filter('user_can_richedit','__return_false',50);
add_action('admin_init', 'grid_init');

add_action('print_media_templates','add_grid_template');

function grid_init() {
  add_action('admin_enqueue_scripts', 'grid_easy_scripts');
}

function grid_easy_scripts( $page ) {
  if ( $page === 'post.php' || $page === 'post-new.php' ) {
    wp_enqueue_style('grid-easy', plugins_url('grid-easy.css', __FILE__ ) );
    wp_enqueue_script('grid-easy', plugins_url('grid-easy.js', __FILE__ ),array(),'0.1',true );
  }
}

function add_grid_template(){
  echo "
    <script type='text/html' id='tmpl-grid-easy'>
      <div class='quicktags-toolbar'>
	  	<button type='button' class='button'>
			<code style='background:none;padding:0;'>container</code>
		</button>
		<button type='button' class='button'>
			<code style='background:none;padding:0;'>container-fluid</code>
		</button>
	  </div>
	  <div id='grid-easy'></div>
	  <div id='grid-easy-edit-area'>
		  <div style='height:calc(100% - 15px);width:100%;margin-top:1em'>
				<textarea style='height:90%;width:100%;font-family:Consolas;font-size:13px;line-height:1.44'></textarea>
				<button type='button' class='button button-primary' id='grid-easy-edit-area-button' style='float:right;margin-top:1em'>Update</button>
		  </div>
      </div>
    </script>
	
	
    <script type='text/html' id='tmpl-grid-easy-buttons'>
		<button type='button' class='wp-switch-editor switch-grid'>Grid</button>
		<button type='button' class='wp-switch-editor switch-html'>Text</button>
    </script>
    
	
	<script type='text/html' id='tmpl-grid-easy-column-control'>
      <div class='column-control' style='margin:0 0 20px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif'>
        <div class='buttons'>
          <a href='#TB_inline?width=900&height=600&inlineId=grid-easy-edit-area' style='position:absolute;bottom:15px;right:15px;' class='button thickbox'>Edit</a>
		  <button type='button' class='button shrink-column' style='height:28px;padding:0 3px;'>
			  <span class='dashicons dashicons-minus' style='pointer-events:none'></span>
			  <span class='screen-reader-text'>Shrink</span>
		  </button>
		  <button type='button' class='button grow-column' style='height:28px;padding:0 3px;'>
			  <span class='dashicons dashicons-plus' style='pointer-events:none'></span>
			  <span class='screen-reader-text'>Grow</span>
		  </button>
		  <button type='button' class='button trash-column' style='height:28px;display:none;padding:0 3px;'>
			  <span class='dashicons dashicons-trash' style='pointer-events:none'></span>
			  <span class='screen-reader-text'>Delete</span>
		  </button>
		  <button type='button' class='button duplicate-column' style='height:28px;display:none;padding:0 3px;'>
			  <span class='dashicons dashicons-admin-page' style='pointer-events:none;transform:rotate(90deg)'></span>
			  <span class='screen-reader-text'>Duplicate</span>
		  </button>
		  <button type='button' class='button button-small' title='Column Settings' style='float:right;background:transparent;border-color:transparent;box-shadow:none;padding:2px 1px 0;margin-top:2px;border-radius:50%;'>
			  <svg aria-hidden='true' role='img' focusable='false' class='dashicon dashicons-ellipsis' xmlns='http://www.w3.org/2000/svg' width='20' height='10' viewBox='5 6 10 10'>
				  <path d='M5 10c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-7 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'></path>
			  </svg>
			  <span class='screen-reader-text'>Column Settings</span>
		  </button>
	  	  <div class='column-control-list' tabindex=0 style='position:absolute;width:150px;right:15px;top:35px;z-index:10;box-shadow:0 5px 10px 0px rgba(0,0,0,0.19);background:#fafafa;padding:.25em 0 .45em;border:1px solid #ddd;font-size:12px;' hidden>
			  <button type='button' style='background:none;border:none;padding:3px 16px 5px 14px;width:100%;text-align:left;'>Insert a row</button>
			  <hr style='margin:2px 10px 1px;'>	  
			  <button type='button' style='background:none;border:none;padding:3px 16px 5px 14px;width:100%;text-align:left;'>Edit column</button>
			  <button type='button' style='background:none;border:none;padding:3px 16px 5px 14px;width:100%;text-align:left;'>Duplicate column</button>
			  <button type='button' style='background:none;border:none;padding:3px 16px 5px 14px;width:100%;text-align:left;'>Remove column</button>
          </div>
        </div>        
      </div>
    </script>
	
	
    <script type='text/html' id='tmpl-grid-easy-row-control'>
      <div class='row-control' style='position:absolute;top:3px;right:10px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif'>
        <button type='button' class='button button-small' title='Row Settings' style='background:transparent;border-color:transparent;box-shadow:none;padding:2px 1px 0;margin-top:2px;border-radius:50%;'>
			<svg aria-hidden='true' role='img' focusable='false' class='dashicon dashicons-ellipsis' xmlns='http://www.w3.org/2000/svg' width='20' height='10' viewBox='5 6 10 10'>
				  <path d='M5 10c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-7 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'></path>
			  </svg>
			<span class='screen-reader-text'>Row Settings</span>
		</button>
        <div class='row-control-list' tabindex=0 style='position:absolute;width:150px;right:0;top:100%;z-index:10;box-shadow:0 5px 10px 0px rgba(0,0,0,0.19);background:#fafafa;padding:.25em 0 .45em;border:1px solid #ddd;font-size:12px;' hidden>
			<button type='button' style='background:none;border:none;padding:3px 16px 5px 14px;width:100%;text-align:left;'>Add a column</button>
			<hr style='margin:2px 10px 1px;'>
			<button type='button' style='background:none;border:none;padding:3px 16px 5px 14px;width:100%;text-align:left;'>Edit row</button>
			<button type='button' style='background:none;border:none;padding:3px 16px 5px 14px;width:100%;text-align:left;'>Duplicate row</button>
			<button type='button' style='background:none;border:none;padding:3px 16px 5px 14px;width:100%;text-align:left;'>Remove row</button>
        </div>
      </div>
    </script>   
  ";
}
