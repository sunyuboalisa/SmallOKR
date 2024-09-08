package alisa.smallokr.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import alisa.smallokr.entity.DicEntry;

@Mapper
public interface DicMapper {
    public List<DicEntry> getDicEntrys(String dicName);
}
