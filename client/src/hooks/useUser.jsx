

const useUser = () => {

    // fetch the tasks' data
    const { data: user, isLoading, refetch } = useQuery({
        queryKey: ['user', user],
        queryFn: async () => {
            const { data } = await axiosSecure(`/tasks/${user?.email}`)
            return data
        }
    })


    return (
        <div>
            
        </div>
    );
};

export default useUser;