-- Migration to sync user role changes to auth.users metadata
-- This ensures that middleware and authentication systems have access to updated role information

-- Create function to sync user role to auth.users metadata
CREATE OR REPLACE FUNCTION public.sync_user_role_to_metadata()
RETURNS TRIGGER AS $$
DECLARE
    current_metadata JSONB;
    updated_metadata JSONB;
BEGIN
    -- Log the sync operation
    RAISE LOG 'Syncing role to metadata for user: % (old role: %, new role: %)', 
        NEW.id, 
        COALESCE(OLD.role::TEXT, 'NULL'), 
        NEW.role::TEXT;
    
    -- Get current raw_user_meta_data
    SELECT raw_user_meta_data INTO current_metadata
    FROM auth.users 
    WHERE id = NEW.id;
    
    -- If no metadata exists, create a new object
    IF current_metadata IS NULL THEN
        current_metadata := '{}'::JSONB;
    END IF;
    
    -- Update the role in the metadata
    updated_metadata := current_metadata || jsonb_build_object('role', NEW.role::TEXT);
    
    -- Update auth.users with the new metadata
    UPDATE auth.users 
    SET 
        raw_user_meta_data = updated_metadata,
        updated_at = NOW()
    WHERE id = NEW.id;
    
    -- Log successful sync
    RAISE LOG 'Successfully synced role % to auth.users metadata for user %', NEW.role::TEXT, NEW.id;
    
    RETURN NEW;
EXCEPTION 
    WHEN OTHERS THEN
        -- Log error but don't fail the transaction
        RAISE WARNING 'Failed to sync role to metadata for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically sync role when users table is updated
DROP TRIGGER IF EXISTS sync_user_role_on_update ON public.users;
CREATE TRIGGER sync_user_role_on_update
    AFTER UPDATE OF role ON public.users
    FOR EACH ROW 
    WHEN (OLD.role IS DISTINCT FROM NEW.role)
    EXECUTE FUNCTION public.sync_user_role_to_metadata();

-- Create function to manually sync all user roles (for one-time cleanup)
CREATE OR REPLACE FUNCTION public.sync_all_user_roles_to_metadata()
RETURNS TABLE(user_id UUID, old_role TEXT, new_role TEXT, success BOOLEAN) AS $$
DECLARE
    user_record RECORD;
    current_metadata JSONB;
    updated_metadata JSONB;
BEGIN
    -- Loop through all users and sync their roles
    FOR user_record IN 
        SELECT u.id, u.role, au.raw_user_meta_data
        FROM public.users u
        JOIN auth.users au ON u.id = au.id
    LOOP
        BEGIN
            -- Get current metadata
            current_metadata := COALESCE(user_record.raw_user_meta_data, '{}'::JSONB);
            
            -- Check if role needs updating
            IF (current_metadata->>'role') IS DISTINCT FROM user_record.role::TEXT THEN
                -- Update the role in the metadata
                updated_metadata := current_metadata || jsonb_build_object('role', user_record.role::TEXT);
                
                -- Update auth.users
                UPDATE auth.users 
                SET 
                    raw_user_meta_data = updated_metadata,
                    updated_at = NOW()
                WHERE id = user_record.id;
                
                -- Return success record
                RETURN QUERY SELECT 
                    user_record.id, 
                    (current_metadata->>'role')::TEXT, 
                    user_record.role::TEXT, 
                    TRUE;
            END IF;
            
        EXCEPTION 
            WHEN OTHERS THEN
                -- Return failure record
                RETURN QUERY SELECT 
                    user_record.id, 
                    (current_metadata->>'role')::TEXT, 
                    user_record.role::TEXT, 
                    FALSE;
        END;
    END LOOP;
    
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.sync_user_role_to_metadata() TO postgres, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.sync_all_user_roles_to_metadata() TO postgres, authenticated, service_role;

-- Log completion
SELECT 'Role sync functions and trigger created successfully' AS status;