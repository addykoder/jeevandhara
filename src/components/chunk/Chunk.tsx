import Loader from "../loader/Loader";

export default function Chunk({ data, fetching }: { data: string; fetching: string }) {
	return fetching === 'pending' ? <Loader height={30} width={30} /> : fetching === 'rejected' ? <p style={{ color: 'red', fontSize: '1.2rem' }}>Error Fetching data</p> : <>{data}</>;
}
